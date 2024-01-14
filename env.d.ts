declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * api 接口服务器
       */
      NEXT_PUBLIC_API_BASE_URL: string;
      /**
       * 项目的根路径
       */
      NEXT_PUBLIC_BASE_PATH: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
