#!/bin/bash

echo "Testing Batch Management Synchronization"
echo "========================================"
echo ""

echo "1. Testing trainer batch creation API..."
curl -X POST http://localhost:8080/api/batches/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Batch", "trainerId": 1}' \
  2>/dev/null | echo "Response: $(cat)"

echo ""
echo "2. Testing trainer batch retrieval API..."
curl -X GET http://localhost:8080/api/batches/trainer/1 \
  -H "Content-Type: application/json" \
  2>/dev/null | echo "Response: $(cat)"

echo ""
echo "3. Testing trainee batch info API..."
curl -X GET http://localhost:8080/api/batches/trainee/1/batch \
  -H "Content-Type: application/json" \
  2>/dev/null | echo "Response: $(cat)"

echo ""
echo "Test completed. Check the responses above for proper JSON structure."
echo "All sections in trainer dashboard should now show consistent batch data."