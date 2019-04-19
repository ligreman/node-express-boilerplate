@api
@F1SessionFeature
Feature: [F1] Test de sesiones
  Como usuario del api
  Quiero poder iniciar sesión
  Para autenticarme y usar el api

  Background:
    Given existen los siguientes usuarios:
      | username | password | role | status |
      | usuario  | 1234     | user | true   |

  Scenario Outline: Intento de login con usuarios no existentes o incorrectos
    Given el api está levantada y la base de datos responde
    When el usuario "<user>" con contraseña "<pass>" intenta autenticarse en el api
    Then la respuesta es un error 401

    Examples:
      | user      | pass  |
      | no_existe | 1234  |
      | no_existe | fffff |

  Scenario Outline: Intento de login con usuarios existentes
    Given el api está levantada y la base de datos responde
    When el usuario "<user>" con contraseña "<pass>" intenta autenticarse en el api
    Then la respuesta es correcta, y devuelve un JSON bien formado
    And el rol del usuario es "<role>"

    Examples:
      | user    | pass | role |
      | usuario | 1234 | user |

  Scenario: Petición a endpoint de logout, con GET cuando sólo admite POST
    Given el api está levantada y la base de datos responde
    When el frontend hace una petición GET, sin cookie, a /logout con los parámetros {}
    Then la respuesta es un error 404

  Scenario: Logout de un usuario no identificado
    Given el api está levantada y la base de datos responde
    When el frontend hace una petición POST, sin cookie, a /logout con los parámetros {}
    Then la respuesta es un error 401

  Scenario: Logout de un usuario identificado
    Given el api está levantada y la base de datos responde
    And el usuario "usuario" con contraseña "1234" está autenticado en el api
    When el frontend hace una petición POST, con cookie, a /logout con los parámetros {}
    Then la respuesta es correcta, y devuelve un JSON bien formado
