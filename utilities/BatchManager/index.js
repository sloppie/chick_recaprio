import { NativeModules } from 'react-native';


export default class BatchManager {

    static archive(context) {
        NativeModules.BatchManager.archive(context); 
    }

    static renameBatch(context, newName) {
        let brief = JSON.parse(NativeModules.FileManager.fetchBriefSync(context));
        brief.name = newName;
        newBrief = JSON.stringify(brief);
        NativeModules.FileManager.writeBrief(context, newBrief);

        NativeModules.BatchManager.rename(context, newName);
    }

    static delete(context) {
        NativeModules.BatchManager.delete(context);
    }

}
