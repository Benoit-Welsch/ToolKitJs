### Url

Conveniently build urls with query parameters.

```typescript
import { Url, Uri } from '@lv00/toolkit';

const url = 'https://lv0.eu/';
const query = {
  p: '2',
  brand: ['sony', 'microsoft', 'nintendo'],
};

const q = Url.buildUrlWithQuery(url, query);
console.log(q.toString()); // https://lv0.eu/?p=2&brand=sony&brand=microsoft&brand=nintendo'

const uri = new Uri(
  url,
  "GET"
  query,
  )
const json = await uri.fetchJson()
```
