import fs from 'fs';
import path from 'path';

export class ConfigJson {
    constructor() {
    }

    save_config(data) {

        const arquivo = './config.json'
        const dir = path.dirname(arquivo);
        fs.mkdirSync(dir, { recursive: true });
        
        console.log('Dados do arquivo -> ', data)
        const jsonString = JSON.stringify(data, null, 4);
        const tmpPath = arquivo + '.tmp';

        fs.writeFileSync(tmpPath, jsonString, { encoding: 'utf-8' });
        fs.renameSync(tmpPath, arquivo);

        return true;
    }

    get_config() {
        try{
            const arquivo = './config.json'
            const data = fs.readFileSync(arquivo, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            return {};
        }
    } 

}