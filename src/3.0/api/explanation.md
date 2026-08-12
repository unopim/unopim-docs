# Response Structure Explained

Every paginated response in this API shares the same shape, and this page walks you through it. Once you understand the top-level keys — `data`, `current_page`, `last_page`, `total`, and `links` — you can navigate any list endpoint.

Taking the categories endpoint as an example, a paginated response looks like this:

~~~json
{
    "data": [{...},{...},...,{...}],
    "current_page": 1,
    "last_page": 2,
    "total": 10,
    "links": {...}
}
~~~

## The Data Object

The `data` key holds the collection of records themselves — in this example, the UnoPim store's categories. Its shape matches the single-record response of the same resource.

## The Pagination Counters

The counters sit at the top level of the response, not inside a nested object:

  | Name          | Info                                                                                               |
  | ------------- | -------------------------------------------------------------------------------------------------- |
  | current_page  | Display the current page number.                                                                   |
  | last_page     | Display the last page number.                                                                      |
  | total         | Display the total number of records matching the request.                                          |

Use the `limit` query parameter to set the page size — it defaults to `10` and is clamped to a maximum of `100` — and `page` to choose the page.

## The Links Object

The `links` key gives you ready-made URLs for moving between pages:

  ~~~json
  "links": {
      "first": "https://example.com/api/v1/rest/categories?limit=5&page=1",
      "last": "https://example.com/api/v1/rest/categories?limit=5&page=2",
      "next": "https://example.com/api/v1/rest/categories?limit=5&page=2",
      "prev": null
  }
  ~~~

Each link serves a distinct purpose:

  | Name          | Info                                                                                                                |
  | ------------- | ------------------------------------------------------------------------------------------------------------------- |
  | first         | Display the first url link of the called API with filter variable.                                                  |
  | last          | Display the last url link of the called API with filter variable.                                                   |
  | prev          | Display the previous url of the current called API url. If no previous url available then it will contain `null`.   |
  | next          | Display the next url of the current called API url. If no next url available then it will contain the `null` value. |

## Cursor Pagination

Deep pages get slower as the offset grows, because the database still has to walk every skipped row. For large catalogs, pass `pagination_type=search_after` to page by cursor instead. The response drops the counters — computing `total` and `last_page` requires the very `COUNT(*)` this mode exists to avoid — and returns a cursor instead:

~~~json
{
    "data": [{...},{...},...,{...}],
    "search_after": 1240,
    "links": {
        "next": "https://example.com/api/v1/rest/products?pagination_type=search_after&search_after=1240"
    }
}
~~~

Follow `links.next` until `search_after` comes back as `null`, which marks the end of the result set.
