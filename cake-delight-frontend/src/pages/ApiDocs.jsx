import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import openapi from "../api/openapi";

function ApiDocs() {
  return (
    <div>
      <SwaggerUI spec={openapi} />
    </div>
  );
}

export default ApiDocs;