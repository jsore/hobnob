# hobnob/spec/cucumber/features/users/retrieve/main.feature

Feature: Search Users

  Clients should be able to send a request to our API in
  order to retrieve a user.

  Background: Create Users from Sample Data
    Given all documents of type "user" are deleted
    And all documents in the "javascript-experts" sample are added to the index with type "user"

#  Scenario: Retrieve Non-existing User
#
#    When the client creates a GET request to /users/non-existent-user
#    And sends the request
#    Then our API should respond with a 404 HTTP status code
#
#  Scenario: Retrieve Existing User
#
#    Given the client creates a POST request to /users/
#    And attaches a valid Create User payload
#    And sends the request
#    And saves the response text in the context under userId
#
#    When the client creates a GET request to /users/:userId
#    And sends the request
#    Then our API should respond with a 200 HTTP status code
#    And the payload of the response should be a JSON object
#    And the root property of the response should be the same as context.requestPayload but without the password field
#    And the entity of type user, with ID stored under userId, should be deleted

  Scenario: No Query Term is Provided
    When the client creates a GET request to /users/
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be an array
    And the response should contain 10 items

  Scenario Outline: When there 10 or fewer users
    Given all documents of type "user" are deleted
    And <count> documents in the "javascript-experts" sample are added to the index with type "user"
    When the client creates a GET request to /users/
    And set "query=" as a query parameter
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be an array
    And the response should contain <count> items

  Examples:

  | count |
  | 0     |
  | 5     |
  | 10    |

  Scenario Outline: Results come back in the correct order if search term is given

    When the client creates a GET request to /users/
    And set "query=<searchTerm>" as a query parameter
    And sends the request
    Then our API should respond with a 200 HTTP status code
    And the payload of the response should be an array
    And the first item of the response should have property profile.name.first set to <firstName>

  Examples:

  | searchTerm    | firstName |
  | Norway        | Sindre    |
  | Google Chrome | Paul      |
  | Osmani        | Addy      |
