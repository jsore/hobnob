# hobnob/spec/cucumber/features/users/create/main.feature
#
# Cucumber specifications of features and steps required to
# test the implementation of the features

Feature: Create User

  Clients should be able to send a request to our API in
  order to create a user. Our API should also validate the
  structure of the payload and respond with an error if it
  is invalid.

  Scenario Outline: Bad Client Requests

  If the client sends a POST request to /users with an empty
  payload, it should receive a response with a 4xx Bad
  Request HTTP Status Code.

    # placeholders denoted by <variable>
    When the client creates a POST request to /users
    And attaches a generic <payloadType> payload
    And sends the request
    Then our API should respond with a <statusCode> HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says <message>

  # using a datatable of keywords and values
  Examples:

  | payloadType | statusCode | message                                                       |
  | empty       | 400        | "Payload should not be empty"                                 |
  | non-JSON    | 415        | 'The "Content-Type" header must always be "application/json"' |
  | malformed   | 400        | "Payload should be in JSON format"                            |

  # refactor using Scenario Outline instead of repeating steps
  #
  # Scenario: Empty Payload
  #
  # If the client sends a POST request to /users with an
  # unsupported payload, it should receive a response with a
  # 4xx status code.
  #
  #   When the client creates a POST request to /users
  #   And attaches a generic empty payload
  #   And sends the request
  #   Then our API should respond with a 400 HTTP status code
  #   And the payload of the response should be a JSON object
  #   And contains a message property which says "Payload should not be empty"
  #
  # Scenario: Payload using Unsupported Media Type
  #
  # If the client sends a POST request to /users with a payload
  # that is not JSON, it should receive a response with a 415
  # Unsupported Media Type HTTP status code.
  #
  #   When the client creates a POST request to /users
  #   And attaches a generic non-JSON payload
  #   And sends the request
  #   Then our API should respond with a 415 HTTP status code
  #   And the payload of the response should be a JSON object
  #   And contains a message property which says 'The "Content-Type" header must always be "application/json"'
  #
  # Scenario: Malformed JSON Payload
  #
  # If the client sends a POST request to /users with a payload
  # that is malformed, it should receive a response with a 400
  # Unsupported Media Type HTTP status code.
  #
  #   When the client creates a POST request to /users
  #   And attaches a generic malformed payload
  #   And sends the request
  #   Then our API should respond with a 400 HTTP status code
  #   And the payload of the response should be a JSON object
  #   And contains a message property which says "Payload should be in JSON format"
