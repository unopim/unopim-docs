# Response Structure Explained

Every paginated response in this API shares the same shape, and this page walks you through it. Once you understand the three top-level keys — `data`, `links`, and `meta` — you can navigate any list endpoint.

Taking the categories endpoint as an example, a paginated response looks like this:

~~~json
{
    "data": [{...},{...},...,{...}],
    "links": {...},
    "meta": {...}
}
~~~

## The Data Object

The `data` key holds the collection of records themselves — in this example, the UnoPim store's categories. Its shape matches the single-record response of the same resource.

## The Links Object

The `links` key gives you ready-made URLs for moving between pages:

  ~~~json
  "links": {
      "first": "https://example.com/api/categories?limit=5&pagination=342234&page=1",
      "last": "https://example.com/api/categories?limit=5&pagination=342234&page=2",
      "prev": null,
      "next": "https://example.com/api/categories?limit=5&pagination=342234&page=2"
  }
  ~~~

Each link serves a distinct purpose:

  | Name          | Info                                                                                                                |
  | ------------- | ------------------------------------------------------------------------------------------------------------------- |
  | first         | Display the first url link of the called API with filter variable.                                                  |
  | last          | Display the last url link of the called API with filter variable.                                                   |
  | prev          | Display the previous url of the current called API url.                                                             |
  | next          | Display the next url of the current called API url. If no next url available then it will contain the `null` value. |

## The Meta Object

The `meta` key appears only on paginated responses and describes where you are in the result set:

  ~~~json
  "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 2,
      "path": "https://example.com/api/categories",
      "per_page": "5",
      "to": 5,
      "total": 10
  }
  ~~~

Here is what each field tells you:

  | Name          | Info                                                                                               |
  | ------------- | -------------------------------------------------------------------------------------------------- |
  | current_page  | Display the current page number.                                                                   |
  | from          | Display the first count of the returned data object based on the provided page and limit filters.  |
  | last_page     | Display the last page number.                                                                      |
  | path          | Display the current api url without input parameters.                                              |
  | per_page      | Display the total of records in a single page.                                                     |
  | to            | Display the last count of the returned data object based on the provided page and limit filters.   |
  | total         | Display the total number of records in the store.                                                  |
