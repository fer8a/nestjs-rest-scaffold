import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: process.env
    .npm_package_name as string,
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env
    .npm_package_version as string,
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env
    .NODE_ENV as string,
});
const traceExporter = new ConsoleSpanExporter();

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
export const otelSdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-nestjs-core': {},
    }),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
