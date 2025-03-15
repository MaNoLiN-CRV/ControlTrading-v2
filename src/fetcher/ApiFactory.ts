import FetchManager from "./Fetch/FetchManager";
import Http from "./http";

type FetchType = 'Fetch' | 'Axios';

class ApiFactory {
    private static manager: Http | null = null;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    /**
     * Create or retrieve an instance of ApiFactory
     * @param type FetchType 'Fetch' | 'Axios'
     * @param baseUrl string
     * @param headers HeadersInit
     * @returns Http
     */
    static createApiFactory(type: FetchType, baseUrl: string, headers?: HeadersInit): Http {
        if (!ApiFactory.manager) {
            ApiFactory.manager = ApiFactory.initializeManager(type, baseUrl, headers);
        }
        return ApiFactory.manager;
    }

    /**
     * Initialize the appropriate manager based on the fetch type
     * @param type FetchType
     * @param baseUrl string
     * @param headers HeadersInit
     * @returns Http
     */
    private static initializeManager(type: FetchType, baseUrl: string, headers?: HeadersInit): Http {
        switch (type) {
            case 'Fetch':
                return new FetchManager(baseUrl, headers);
            default:
                throw new Error(`Unsupported fetch type: ${type}`);
        }
    }

    /**
     * Retrieve the existing FetchManager instance
     * @returns Http
     */
    static getFetchManager(): Http {
        if (!ApiFactory.manager) {
            throw new Error("FetchManager has not been initialized. Call createApiFactory first.");
        }
        return ApiFactory.manager;
    }
}

export default ApiFactory;