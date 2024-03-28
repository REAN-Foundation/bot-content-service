# System Design Documentation

## Goals of the Current System Design

The current system design emphasizes the freedom to choose individual components in multiple areas. The service provides default modules but supports the replacement of these modules with custom ones. The areas supporting replicable modules include:

-   _Database Engines:_ Through a basic repository interface, supporting any SQL database through TypeORM (Tested with MySQL).

## Technology Stack

1. Node.js
2. TypeScript
3. TypeORM
4. MySQL

## Recommended Tools on Development Machine

-   Visual Studio Code with the following extensions:
    -   ESLint
    -   DotENV
    -   Prettier Code Formatter by Prettier
-   MySQL Workbench
-   Postman

## Setup

-   Database migration is done automatically on launching the application.
-   Testing the service with Postman: A comprehensive set of Postman requests is available in the collection 'bot-content-service.postman_collection.json'.
-   Import the Postman collection JSON file.
-   It is advisable to execute the requests in sequential order from top-to-bottom.

## System Goals

1. _Open Architecture:_

    - Allow for different types of Documents (text, image, audio) by defining an interface for Document types.
    - Users can define custom Document types that implement this interface.

2. _Versioning and History:_

    - Support versioning of Documents and track changes over time.
    - Store historical versions of Documents and provide APIs to retrieve and manage these versions.

3. _Scalability and Performance:_

    - Design the service to be scalable and performant, especially with a large number of Documents.

4. _Audit Logging and Monitoring:_

    - Implement audit logging to track actions performed on Documents.
    - Monitoring to ensure the service is performing as expected.

5. _Customization and Extensibility:_
    - Allow users to customize and extend the service to meet specific needs.
    - Provide hooks or APIs for adding custom logic or integrating with external systems.

## Service Purpose

The Document Management Service handles the creation, organization, storage, retrieval, and maintenance of documents within a system. It ensures seamless document management, making documents easily accessible, versioned, and secured.

## Key Components

1. _Document Entity:_

    - Represents a document with attributes such as content, metadata, version history, and permissions.

2. _Document Repository:_

    - Manages the storage and retrieval of document entities, abstracting the underlying data storage technology for scalability and performance.

3. _Document Service:_

    - Implements business logic related to document management, including validation, access control, versioning, and integration with other services.

4. _Search and Indexing Module:_

    - Provides efficient search capabilities and indexing of document content for quick retrieval.

5. _Security and Access Control:_
    - Enforces access control policies to ensure authorized users can create, view, edit, or delete documents.

## Design Considerations

-   _Scalability:_

    -   Design the service to handle a large volume of documents and user interactions for future growth.

-   _Versioning:_

    -   Implement a robust version control system to track changes to documents over time, allowing users to review and revert to previous versions.

-   _Integration:_

    -   Ensure seamless integration with other services within the system for a cohesive user experience and data flow.

-   _Audit Trail:_

    -   Maintain an audit trail to track actions performed on documents, aiding accountability and compliance requirements.

-   _Extensibility:_

    -   Provide a way to define and manage different types of Documents for users to customize based on their needs.

-   _Integration:_

    -   Integrate with other services or APIs, such as language models or natural language processing services, to enhance Document generation and processing capabilities.

-   _Versioning:_

    -   Support versioning of Documents to track changes and enable rollback to previous versions if needed.

-   _Performance:_
    -   Optimize for performance, especially for operations like Document retrieval and generation, to ensure fast response times even with large volumes of Documents.

## Control Flow of the System

1. Incoming request is processed through a standard set of middlewares.
2. Requests are gathered in the router file for specific routing.
3. Validators process the request input and convert it to domain models (Validation is done by the Joi library).
4. Controllers accept domain models and call one or more services based on business logic.
5. Services pass the domain models to database repository interfaces.
6. Database repository interfaces convert domain models to database models and perform relevant actions.
7. The database models returned by the database ORM are converted by repository interfaces into DTOs.
8. Controllers embed DTOs into the response.
9. Response is served.
