### Prompt 1

Requiero que te bases en la carpeta @backend y me ayudes a crear el endpoint para el siguiente requerimiento, debes tener en cuenta los principios SOLID y DRY asi como DDD:

GET /position/:id/candidates

Este endpoint recogerá todos los candidatos en proceso para una determinada posición, es decir, todas las aplicaciones para un determinado positionID. Debe proporcionar la siguiente información básica:

- Nombre completo del candidato (de la tabla candidate).
- current_interview_step: en qué fase del proceso está el candidato (de la tabla application).
- La puntuación media del candidato. Recuerda que cada entrevist (interview) realizada por el candidato tiene un score.

### Prompt 2

Requiero ahora que nuevamente te bases en la carpeta @backend y me ayudes a crear el endpoint para el siguiente requerimiento, debes tener en cuenta los principios SOLID y DRY asi como DDD:

PUT /candidate/:id

Este endpoint actualizará la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico.

