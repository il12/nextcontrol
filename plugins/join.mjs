import { Sentences } from '../lib/sentences.mjs';
import { logger, format, stripFormatting } from '../lib/utilities.mjs';
import { Settings } from '../settings.mjs';

/**
 * Join and leave message plugin
 */
export class Join {
    constructor(conns) {
        // plugin name:
        this.name           = 'Join and Leave'
        this.author         = 'dassschaf'
        this.description    = 'Join and leave message plugin'

        this.client = conns.client;
        this.database = conns.database;
    }

    async onPlayerConnect(params) {
        
        let serverPlayerInfo = await this.client.getPlayerInfo(params.login),
            playerInfo = await this.database.getPlayerInfo(params.login);

        if (serverPlayerInfo.login != playerInfo.login)
            playerInfo = serverPlayerInfo;           
        
        this.database.updatePlayerInfo(playerInfo);

        logger('r', stripFormatting(playerInfo.name) + ' has joined the server');
        this.client.chatSendServerMessage(format(Sentences.playerConnect, [playerInfo.name]));
    }

    async onPlayerDisconnect(params) {
        let playerInfo = await this.database.getPlayerInfo(params.login);

        if (playerInfo.login == undefined)
            playerInfo = {name: 'unknown', login: 'unknown'};

        logger('r', stripFormatting(playerInfo.name) + ' has left the server');
        this.client.chatSendServerMessage(format(Sentences.playerDisconnect, [playerInfo.name]));
    }
}