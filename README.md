# Trading Documentation

This document provides an overview of the Trading application developed using Nest.js. The application exposes two endpoints: `/gasPrice` and `/return/:fromTokenAddress/:toTokenAddress/:amountIn`. These endpoints allow clients to retrieve the latest gas price on the Ethereum network and to estimate the output amount for token trades on UniswapV2, respectively.

## Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
  - [GET /gasPrice](#get-gasprice)
  - [GET /return/:fromTokenAddress/:toTokenAddress/:amountIn](#get-returnfromtokenaddresstotokenaddressamountin)
- [Error Handling](#error-handling)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Swagger Documentation](#swagger-documentation)

## Overview

The Trading Microservices application is built with Nest.js and provides two main functionalities:

1. Retrieve the current gas price on the Ethereum network.
2. Estimate the output amount for a given input amount when trading tokens on UniswapV2.

## Endpoints

### GET /gasPrice

#### Description

Fetches the current gas price

#### Response

- **Status Code:** 200
- **Response Body:**
  ```json
  {
    "gasPrice": "string"
  }
  ```

#### Example Request

```bash
GET /gasPrice
```

#### Example Response

```json
{
  "gasPrice": "20000000000"
}
```

### GET /return/:fromTokenAddress/:toTokenAddress/:amountIn

#### Description

Fetches an estimated output amount for a given input amount when trading from `fromTokenAddress` to `toTokenAddress` on UniswapV2.

#### Parameters

- `fromTokenAddress` (string): The address of the source token.
- `toTokenAddress` (string): The address of the destination token.
- `amountIn` (string): The amount of the source token to trade.

#### Response

- **Status Code:** 200
- **Response Body:**
  ```json
  {
    "amountOut": "string"
  }
  ```

#### Example Request

```bash
GET /return/0xSourceTokenAddress/0xDestinationTokenAddress/1000000000000000000
```

#### Example Response

```json
{
  "amountOut": "950000000000000000"
}
```

## Error Handling

The application performs validation on the input parameters and returns appropriate error messages if the input is invalid.

- **Invalid `fromTokenAddress` or `toTokenAddress`:**
  - **Status Code:** 400
  - **Response Body:**
    ```json
    {
      "statusCode": 400,
      "message": "Invalid fromTokenAddress",
      "error": "Bad Request"
    }
    ```
- **Invalid `amountIn`:**
  - **Status Code:** 400
  - **Response Body:**
    ```json
    {
      "statusCode": 400,
      "message": "Invalid amountIn",
      "error": "Bad Request"
    }
    ```

## Setup and Installation

To set up and run the Trading Microservices application, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/akhmaos/trading-example.git
   cd trading-example
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and set the necessary environment variables.

   ```bash
   cp ./env/env.local .env
   ```

4. **Build the application:**
   ```bash
   npm run build
   ```

## Running the Application

To run the application, use the following command:

```bash
npm run start
```

The application will be available at `http://0.0.0.0:3000`.

## Testing

To run tests, use the following command:

```bash
npm run test
```

This will execute the unit and integration tests to ensure the application's functionality is working as expected.

## Swagger Documentation

For detailed API documentation using Swagger UI, you can access it by running the application and visiting `http://0.0.0.0:3000/docs`. This interactive documentation provides a user-friendly interface to explore the endpoints, parameters, and responses of the Trading API.
