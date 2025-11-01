#!/bin/bash
# Fix all ESLint errors

# Fix apostrophes
find src -name "*.tsx" -type f -exec sed -i '' "s/We've/We\&apos;ve/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/can't/can\&apos;t/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/don't/don\&apos;t/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/won't/won\&apos;t/g" {} \;
find src -name "*.tsx" -type f -exec sed -i '' "s/didn't/didn\&apos;t/g" {} \;

# Fix any types - replace with unknown
find src -name "*.tsx" -type f -exec sed -i '' 's/catch (err: any)/catch (err: unknown)/g' {} \;
find src -name "*.tsx" -type f -exec sed -i '' 's/catch (error: any)/catch (error: unknown)/g' {} \;
find src -name "*.tsx" -type f -exec sed -i '' 's/catch (e: any)/catch (e: unknown)/g' {} \;

echo "ESLint fixes applied"
