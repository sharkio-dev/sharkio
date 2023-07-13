import { CGX } from './traffic-cli.js';

export function index(): Promise<any> {
  return CGX();
};

index();