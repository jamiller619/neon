/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Should the Admin client open in a new browser tab when the server starts?
 */
export type AutoLaunchAdminClient = boolean;
/**
 * URL to the FFmpeg binary file.
 */
export type FFmpegBinary = string;
/**
 * URL to the FFprobe binary file.
 */
export type FFprobeBinary = string;
/**
 * The port the HTTP server will listen on.
 */
export type HTTPServerPort = number;

export interface ConfigSchema {
  "admin.autoLaunch": AutoLaunchAdminClient;
  "ffmpeg.url": FFmpegBinary;
  "ffprobe.url": FFprobeBinary;
  "http.port": HTTPServerPort;
}