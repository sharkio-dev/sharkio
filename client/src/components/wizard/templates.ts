export const USERS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "name": "{{faker "person.firstName"}}",
        "LastName": "{{faker "person.lastName"}}",
        "email": "{{faker "internet.email"}}",
        "phone": "{{faker "phone.phoneNumber"}}",
        "image": "{{faker "image.avatar"}}"
    }
{{/repeat}}
]`;

export const POSTS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "title": "{{faker "lorem.sentence"}}",
        "body": "{{faker "lorem.paragraph"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const COMMENTS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "name": "{{faker "person.firstName"}}",
        "email": "{{faker "internet.email"}}",
        "body": "{{faker "lorem.paragraph"}}"
    }
{{/repeat}}
]`;

export const ADDRESSES_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "street": "{{faker "address.streetAddress"}}",
        "city": "{{faker "address.city"}}",
        "zipcode": "{{faker "address.zipCode"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const LIKES_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "title": "{{faker "lorem.sentence"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const FOLLOWERS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "name": "{{faker "person.firstName"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const TODOS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "title": "{{faker "lorem.sentence"}}",
        "completed": "{{faker "random.boolean"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const ALBUMS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "title": "{{faker "lorem.sentence"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const PHOTOS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "title": "{{faker "lorem.sentence"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const CATEGORIES_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "name": "{{faker "commerce.department"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;

export const PRODUCTS_TEMPLATE = `[
{{#repeat 10 comma=true}}
    {
        "id": "{{faker "string.uuid"}}",
        "name": "{{faker "commerce.productName"}}",
        "price": "{{faker "commerce.price"}}",
        "image": "{{faker "image.abstract"}}"
    }
{{/repeat}}
]`;
