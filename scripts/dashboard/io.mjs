import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateKeyConfig} from './lib.mjs';

export const DEFAULT_VAULT='/Volumes/data/Obsidian/akm';
export const DEFAULT_KEY=path.join(os.homedir(),'.config/dexa-dash/key.json');
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));

export function readKeyConfig(file=DEFAULT_KEY) {
  const st=fs.lstatSync(file);
  if(st.isSymbolicLink())throw Error('Local key must not be a symbolic link');
  if(!st.isFile()||(st.mode&0o077)!==0||st.uid!==process.getuid())throw Error('Local key requires owner-only permissions (0600)');
  return validateKeyConfig(json(file));
}

export function atomicWrite(file,content,mode=0o644) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const temp=file+'.tmp-'+randomBytes(8).toString('hex');
  const fd=fs.openSync(temp,'wx',mode);
  try{fs.writeFileSync(fd,content);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  fs.renameSync(temp,file);
  const dir=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}
}

