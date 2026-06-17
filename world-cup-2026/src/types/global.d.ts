/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare function definePageConfig(config: Record<string, any>): Record<string, any>
