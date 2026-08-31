import { k8sCoreApi } from "./config.js"

export async function createService(sandboxId) {
    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId
            }
        },
        spec: {
            selector: {
                app: 'sandbox',
                sandboxId
            },
            ports: [{
                port: 5173,
                targetPort: 5173,
                name: "http"
            }],
            type: "ClusterIP"
        }
    }

    const response = await k8sCoreApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })

    return response
}