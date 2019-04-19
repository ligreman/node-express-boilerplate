@api
@F2AdminFeature
Feature: [F2] Administración: actualizar un usuario
  Como administrador
  Quiero poder modificar los datos de un usuario
  Para gestionar los usuarios

  Background:
    Given existen los siguientes usuarios:
      | id | username | password | role  | status |
      | 1  | manolo   | 1234     | user  | true   |
      | 2  | manolo2  | 1234     | user  | true   |
      | 3  | admin    | 1234     | admin | true   |


  Scenario Outline: Un administrador modifica un usuario
    Given el api está levantada y la base de datos responde
    And el usuario "admin" con contraseña "1234" está autenticado en el api
    And recojo la información actual del usuario <userId> de BBDD en la variable "user_previous_data"
    When el frontend hace una petición POST, con cookie, a /users/<userId> con los parámetros <params>
    Then la respuesta es correcta, y devuelve un JSON bien formado
    And se ha modificado el usuario <userId>, cuyos datos previos están en "user_previous_data", con los datos <params>

    Examples:
      | userId | params                              |
      | 1      | {"status":false, "role": "admin"}   |
      | 2      | {"password":"abc", "role": "admin"} |


  Scenario: Un usuario no administrador intenta modificar un usuario
    Given el api está levantada y la base de datos responde
    And el usuario "manolo" con contraseña "1234" está autenticado en el api
    When el frontend hace una petición POST, con cookie, a /users/1 con los parámetros {"role": "admin"}
    Then la respuesta es un error 403

