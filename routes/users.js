// routes/users.js
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const axios = require('axios');
const config = require('../config');
const models = require('../models');
const decryptData = require('../utils/decrypted-data');

const GROUP_NAME = 'users';

module.exports = [
  {
    method: 'POST',
    path: `/${GROUP_NAME}/createJWT`,
    handler: async (request, reply) => {
      const generateJWT = (jwtInfo) => {
        const payload = {
          userId: jwtInfo.userId,
          exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
        };
        return JWT.sign(payload, config.jwtSecret);
      };
      reply(generateJWT({
        userId: 1,
      }));
    },
    config: {
      tags: ['api', GROUP_NAME],
      description: '用于测试的用户 JWT 签发',
      auth: false, // 约定此接口不参与 JWT 的用户验证，会结合下面的 hapi-auth-jwt 来使用
    },
  },
  // 获取小程序用户登录
  {
    method: 'POST',
    path: `/${GROUP_NAME}/wxLogin`,
    handler: async (req, reply) => {
      const appid = config.wxAppid; // 你的小程序 appid
      const secret = config.wxSecret; // 你的小程序 appsecret
      const { code, encryptedData, iv } = req.payload;
      // 向微信小程序开放平台 换取openid 与 session_key
      const response = await axios({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        method: 'GET',
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        }
      });
      // response 中返回 openid 与 session_key
      const { openid, session_key: sessionKey } = response.data;
      // 基于 openid 查找或创建一个用户
      const user = await models.users.findOrCreate({
        where: { open_id: openid },
      });
      // decrypt 解码用户信息
      const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
      // 更新 user 表中的用户的资料信息
      await models.users.update({
        nick_name: userInfo.nickName,
        gender: userInfo.gender,
        avatar_url: userInfo.avatarUrl,
        open_id: openid,
        session_key: sessionKey,
      },{
        where: { open_id: openid },
      });
      
      // 签发 jwt
      const generateJWT = (jwtInfo) => {
        const payload = {
          userId: jwtInfo.userId,
          exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
        };
        return JWT.sign(payload, config.jwtSecret);
      };
      reply(generateJWT({
        userId: user[0].id,
      }));
    },
    config: {
      auth: false, // 不需要用户验证
      tags: ['api', GROUP_NAME], // 注册 swagger 文档
      description: '通过 openid 换取本地数据库的 user_id，签发 JWT',
      validate: {
        payload: {
          code: Joi.string().required().description('微信用户登录的临时code'),
          encryptedData: Joi.string().required().description('微信用户信息encryptedData'),
          iv: Joi.string().required().description('微信用户信息iv'),
        },
      },
    },
  },
];