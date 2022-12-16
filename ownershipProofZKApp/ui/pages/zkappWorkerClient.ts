import {
  fetchAccount,
  PublicKey,
  PrivateKey,
  Field,
} from 'snarkyjs'

import type { ZkappWorkerRequest, ZkappWorkerReponse, WorkerFunctions } from './zkappWorker';

export default class ZkappWorkerClient {

  // ---------------------------------------------------------------------------------------

  loadSnarkyJS() {
    return this._call('loadSnarkyJS', {});
  }

  setActiveInstanceToBerkeley() {
    return this._call('setActiveInstanceToBerkeley', {});
  }

  setActiveInstanceToLocal() {
    return this._call('setActiveInstanceToLocal', {});
  }

  loadContract() {
    return this._call('loadContract', {});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  async deployContract(){
    return await this._call('deployContract', {});
  }

  async initContract(){
    return await this._call('initContract', {});
  }

  fetchAccount({ publicKey }: { publicKey: PublicKey }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', { publicKey58: publicKey.toBase58() });
    return (result as ReturnType<typeof fetchAccount>);
  }

  initZkappInstance(publicKey: PublicKey) {
    return this._call('initZkappInstance', { publicKey58: publicKey.toBase58() });
  }

  async getCommitmentNFTHolders(): Promise<Field> {
    const result = await this._call('getCommitmentNFTHolders', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  async createValidateNFTHolderTransaction(response: string, holderPosition: string) {
    return await this._call('createValidateNFTHolderTransaction', {response: response, holderPosition: holderPosition});
  }

  async createValidateAndStoreNFTHolderTransaction(response: string, holderPosition: string, minaAddress: string) {
    return await this._call('createValidateAndStoreNFTHolderTransaction', {response: response, holderPosition: holderPosition, minaAddress: minaAddress});
  }

  async sendValidateNFTHolderTransactionLocal(response: string, holderPosition: string) {
    return await this._call('sendValidateNFTHolderTransactionLocal', {response: response, holderPosition: holderPosition});
  }

  proveUpdateTransaction() {
    return this._call('proveUpdateTransaction', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  async getNumValidatedNFTHolders(): Promise<Field> {
    const result = await this._call('getNumValidatedNFTHolders', {});
    return Field.fromJSON(JSON.parse(result as string));
  }

  
  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: { [id: number]: { resolve: (res: any) => void, reject: (err: any) => void } };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkappWorker.ts', import.meta.url))
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject }

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}

