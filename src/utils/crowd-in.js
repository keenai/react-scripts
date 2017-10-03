// @flow
import { basename } from 'path';
import { createReadStream } from 'fs';
import querystring from 'querystring';
import request from 'request';

type Language = {
  can_approve: boolean,
  can_translate: boolean,
  code: string,
  name: string,
};

type ProjectInformation = {
  languages: Array<Language>,
}

export default class {
  projectId: string;
  projectKey: string;

  constructor(projectId: string, projectKey: string) {
    this.projectId = projectId;
    this.projectKey = projectKey;
  }

  exportFile(filename: string, language: string): Promise<Object> {
    return this.fetch('/export-file', {
      query: {
        export_approved_only: 1,
        file: filename,
        language,
      },
    });
  }

  fetch(endpoint: string, options?: Object = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      request(
        {
          method: 'GET',
          url: this.url(endpoint, options.query),
          ...options,
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }

          if (response.statusCode >= 400) {
            try {
              const json = JSON.parse(body);

              return reject(new Error(`[Error Code ${json.error.code}] ${json.error.message}`));
            } catch (e) {
              return reject(new Error(body));
            }
          }

          if (response.headers['content-type'] === 'application/json') {
            return resolve(JSON.parse(body));
          }

          return resolve(body);
        },
      );
    });
  }

  getProjectInformation(): Promise<ProjectInformation> {
    return this.fetch('/info');
  }

  updateFile(filename: string): Promise<void> {
    return this.fetch('/update-file', {
      method: 'POST',
      formData: {
        [`files[${basename(filename)}]`]: createReadStream(filename),
      },
    });
  }

  url(endpoint: string, query: Object = {}) {
    const qs = querystring.stringify({
      ...query,
      json: true,
      key: this.projectKey,
    });

    return `https://api.crowdin.com/api/project/${this.projectId}/${endpoint.replace(/^\//, '')}?${qs}`;
  }
}
