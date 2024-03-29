# Serverless Email Verification Function

This repository contains the code for a serverless Google Cloud Function designed to send email verifications to users upon new account creation. It is triggered by a message published to a Google Cloud Pub/Sub topic, extracts user information from the message, and sends an email with a verification link.

## Overview

The function listens for messages on a specified Google Cloud Pub/Sub topic. When a new user is created in the application, a message containing the user's information is published to this topic. The function then sends an email to the user's email address with a link they can click to verify their email address.

## Prerequisites

- Google Cloud Platform account
- Google Cloud SDK installed and initialized
- Access to Google Cloud Pub/Sub and Google Cloud Functions
- A SendGrid account and API key for sending emails

## Setup

1. **Google Cloud Setup**: Ensure you have a Google Cloud project with the Cloud Functions and Cloud Pub/Sub APIs enabled.
2. **Environment Variables**: Set up the following environment variables in your Cloud Function:
   - `SENDGRID_API_KEY`: Your SendGrid API key for sending emails.
   - `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_CONNECTION_NAME`: Database credentials for logging email sends (if applicable).
3. **Deploy the Function**: Use the Google Cloud SDK to deploy the function to your Google Cloud project.

## Deploying the Function

To deploy the function, run the following command in the root directory of this project:

```bash
gcloud functions deploy sendVerificationEmail \
  --runtime nodejs18 \
  --trigger-topic YOUR_PUBSUB_TOPIC_NAME \
  --region YOUR_GCP_REGION \
  --set-env-vars SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
```

Replace `YOUR_PUBSUB_TOPIC_NAME`, `YOUR_GCP_REGION`, and `YOUR_SENDGRID_API_KEY` with your Google Cloud Pub/Sub topic name, desired Google Cloud region, and SendGrid API key, respectively.

## Contributors

Qian Chen

