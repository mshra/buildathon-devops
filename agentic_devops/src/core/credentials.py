"""
Credentials Module - Provides secure credential management for DevOps operations.

This module defines credential models and a credential manager for securely accessing
and managing AWS, GitHub, and other service credentials.
"""

import os
import json
import logging
from typing import Dict, Optional, Any
from pathlib import Path
import boto3
from botocore.exceptions import ProfileNotFound

from pydantic import BaseModel, Field

# Configure logging
logger = logging.getLogger(__name__)

# Custom exceptions
class CredentialError(Exception):
    """Exception raised for credential-related errors."""
    def __init__(self, message, suggestion=None):
        super().__init__(message)
        self.suggestion = suggestion or "Check your credential configuration."


# Credential models
class AWSCredentials(BaseModel):
    """AWS credentials model."""
    access_key_id: Optional[str] = Field(None, description="AWS Access Key ID")
    secret_access_key: Optional[str] = Field(None, description="AWS Secret Access Key")
    session_token: Optional[str] = Field(None, description="AWS Session Token")
    region: str = Field("us-west-2", description="AWS Region")
    profile: Optional[str] = Field(None, description="AWS Profile name")


class GitHubCredentials(BaseModel):
    """GitHub credentials model."""
    token: str = Field(..., description="GitHub Personal Access Token")
    api_url: str = Field("https://api.github.com", description="GitHub API URL")


class CredentialManager:
    """
    Credential Manager for securely accessing and managing service credentials.
    """
    
    def __init__(self):
        """Initialize the credential manager."""
        self._aws_credentials: Optional[AWSCredentials] = None
        self._github_credentials: Optional[GitHubCredentials] = None
    
    def get_aws_credentials(self, region: Optional[str] = None) -> AWSCredentials:
        """
        Get AWS credentials.
        
        Args:
            region: AWS region to use (overrides default)
            
        Returns:
            AWSCredentials object
            
        Raises:
            CredentialError: If AWS credentials cannot be loaded
        """
        if self._aws_credentials is None:
            self._load_aws_credentials()
        
        # Create a copy of the credentials
        credentials = AWSCredentials(**self._aws_credentials.dict())
        
        # Override region if provided
        if region:
            credentials.region = region
        
        return credentials
    
    def get_github_credentials(self) -> GitHubCredentials:
        """
        Get GitHub credentials.
        
        Returns:
            GitHubCredentials object
            
        Raises:
            CredentialError: If GitHub credentials cannot be loaded
        """
        if self._github_credentials is None:
            self._load_github_credentials()
        
        return self._github_credentials
    
    def _load_aws_credentials(self) -> None:
        """
        Load AWS credentials from environment variables or AWS config.
        
        Raises:
            CredentialError: If AWS credentials cannot be loaded
        """
        # Try to load from environment variables first
        access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
        secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        session_token = os.environ.get('AWS_SESSION_TOKEN')
        region = os.environ.get('AWS_REGION') or os.environ.get('AWS_DEFAULT_REGION', 'us-west-2')
        profile = os.environ.get('AWS_PROFILE')
        
        # If access key and secret key are provided, use them
        if access_key_id and secret_access_key:
            self._aws_credentials = AWSCredentials(
                access_key_id=access_key_id,
                secret_access_key=secret_access_key,
                session_token=session_token,
                region=region,
                profile=profile
            )
            logger.info("AWS credentials loaded from environment variables")
            return
        
        # If profile is provided, try to load from AWS config
        if profile:
            try:
                # Create a session with the profile
                session = boto3.Session(profile_name=profile)
                credentials = session.get_credentials()
                
                if credentials:
                    self._aws_credentials = AWSCredentials(
                        access_key_id=credentials.access_key,
                        secret_access_key=credentials.secret_key,
                        session_token=credentials.token,
                        region=session.region_name or region,
                        profile=profile
                    )
                    logger.info(f"AWS credentials loaded from profile: {profile}")
                    return
            except ProfileNotFound:
                logger.warning(f"AWS profile not found: {profile}")
        
        # Try to load from default profile
        try:
            # Create a session with the default profile
            session = boto3.Session()
            credentials = session.get_credentials()
            
            if credentials:
                self._aws_credentials = AWSCredentials(
                    access_key_id=credentials.access_key,
                    secret_access_key=credentials.secret_key,
                    session_token=credentials.token,
                    region=session.region_name or region,
                    profile=None
                )
                logger.info("AWS credentials loaded from default profile")
                return
        except Exception as e:
            logger.warning(f"Failed to load AWS credentials from default profile: {e}")
        
        # If we get here, we couldn't load credentials
        logger.warning("No AWS credentials found, using empty credentials")
        self._aws_credentials = AWSCredentials(region=region)
    
    def _load_github_credentials(self) -> None:
        """
        Load GitHub credentials from environment variables.
        
        Raises:
            CredentialError: If GitHub credentials cannot be loaded
        """
        # Try to load from environment variables
        token = os.environ.get('GITHUB_TOKEN')
        api_url = os.environ.get('GITHUB_API_URL', 'https://api.github.com')
        
        if not token:
            # Try to load from credentials file
            credentials_file = os.path.expanduser('~/.devops/credentials.json')
            if os.path.exists(credentials_file):
                try:
                    with open(credentials_file, 'r') as f:
                        credentials = json.load(f)
                        if 'github' in credentials and 'token' in credentials['github']:
                            token = credentials['github']['token']
                            logger.info("GitHub credentials loaded from credentials file")
                except Exception as e:
                    logger.warning(f"Failed to load GitHub credentials from file: {e}")
        
        if not token:
            raise CredentialError(
                "No GitHub token found",
                "Set the GITHUB_TOKEN environment variable or add it to ~/.devops/credentials.json"
            )
        
        self._github_credentials = GitHubCredentials(
            token=token,
            api_url=api_url
        )
        logger.info("GitHub credentials loaded")


# Global credential manager instance
_credential_manager: Optional[CredentialManager] = None


def get_credential_manager() -> CredentialManager:
    """
    Get the global credential manager instance.
    
    Returns:
        CredentialManager instance
    """
    global _credential_manager
    
    if _credential_manager is None:
        _credential_manager = CredentialManager()
    
    return _credential_manager


def set_credential_manager(manager: CredentialManager) -> None:
    """
    Set the global credential manager instance.
    
    Args:
        manager: CredentialManager instance to use
    """
    global _credential_manager
    _credential_manager = manager