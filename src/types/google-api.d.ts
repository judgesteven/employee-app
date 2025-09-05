// Google API type declarations for Google Fit Web API

declare global {
  interface Window {
    gapi: any;
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
          hasGrantedAllScopes: (tokenResponse: any, ...scopes: string[]) => boolean;
        };
      };
    };
  }
}

export interface GoogleAuthInstance {
  isSignedIn: {
    get(): boolean;
  };
  signIn(): Promise<any>;
  signOut(): Promise<any>;
}

export interface GoogleFitDataPoint {
  value: Array<{
    intVal?: number;
    fpVal?: number;
  }>;
  startTimeNanos?: string;
  endTimeNanos?: string;
}

export interface GoogleFitDataset {
  point?: GoogleFitDataPoint[];
}

export interface GoogleFitBucket {
  dataset?: GoogleFitDataset[];
  startTimeMillis?: string;
  endTimeMillis?: string;
}

export interface GoogleFitAggregateResponse {
  result: {
    bucket?: GoogleFitBucket[];
  };
}

export interface GoogleFitAggregateRequest {
  aggregateBy: Array<{
    dataTypeName: string;
    dataSourceId?: string;
  }>;
  bucketByTime: {
    durationMillis: number;
  };
  startTimeMillis: number;
  endTimeMillis: number;
}

export {};
