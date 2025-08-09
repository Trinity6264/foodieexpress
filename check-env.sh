#!/bin/bash

echo "🔍 Checking Firebase Environment Variables..."

echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:10}..."

# Check if variables are set
if [ -z "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ]; then
    echo "❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set"
else
    echo "✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID is set"
fi

if [ -z "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" ]; then
    echo "❌ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is not set"
else
    echo "✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is set"
fi

if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    echo "❌ NEXT_PUBLIC_FIREBASE_API_KEY is not set"
else
    echo "✅ NEXT_PUBLIC_FIREBASE_API_KEY is set"
fi
