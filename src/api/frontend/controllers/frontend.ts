import {choicePhotos} from "../helper/getPhotoUrl";
import {IWorker} from "../../../../types/IWorker";
import {ILocalWorkTime, IWorkTime} from "../../../../types/IWorkTime";
import {IWork} from "../../../../types/IWork";
import axios from 'axios';
import {IPhoto} from "../../../../types/IPhoto";
import {IUWork} from "../../../../types/IUWork";
import FormData from "form-data";
import {IUWorkTime} from "../../../../types/IUWorkTime";

export default {
  getUsers: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const documents = await strapi.documents('api::token.token').findMany({
        fields: ['level', 'name', 'id'],
      })
      ctx.body = JSON.stringify(documents)
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  getWorkTime: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      const documents = await strapi.documents('api::token.token').findFirst({
        filters: {
          id: {
            $eq: id
          }
        },
        fields: ['id'],
        populate: {
          worktimes: {
            fields: ['start', 'end', 'done'],
            populate: {
              finish: true,
              work: {
                fields: ['name', 'description', 'id'],
                populate: {
                  photos: true,
                }
              }
            }
          }
        }
      })
      const data = []
      for (const document of (documents as IWorkTime).worktimes) {
        data.push({
          start: document.start,
          end: document.end,
          done: document.done,
          finish: choicePhotos(document.finish),
          work: {
            name: document.work.name,
            description: document.work.description,
            photos: choicePhotos(document.work.photos),
          }
        })
      }
      ctx.body = JSON.stringify(data)
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  getWorkTimes: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const documents = await strapi.documents('api::worktime.worktime').findMany({
        fields: ['id', 'start', 'end', 'done'],
        populate: {
          finish: true,
          work: {
            fields: ['name', 'description', 'id'],
            populate: {
              photos: true,
            }
          }
        }
      })
      const data = []
      for (const document of (documents as ILocalWorkTime[])) {
        data.push({
          id: document.id,
          documentId: document.documentId,
          start: document.start,
          end: document.end,
          done: document.done,
          finish: choicePhotos(document.finish),
          work: {
            name: document.work.name,
            description: document.work.description,
            photos: choicePhotos(document.work.photos),
          }
        })
      }
      return JSON.stringify(data)
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  getToken: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { login, password } = ctx.query
      const document = await strapi.documents('api::token.token').findFirst({
        fields: ['token', 'password'],
        filters: {
          login: {
            $eq: login
          },
        }
      })
      const bcrypt = require('bcrypt');
      const isPasswordValid = await bcrypt.compare(password, document.password);
      if (isPasswordValid) ctx.body = JSON.stringify({ token: document.token })
      else ctx.throw(400, 'Password not found')
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  createNewWorker: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { login, password, name } = ctx.query
      ctx.body = await strapi.documents('api::token.token').create({
        data: {
          login,
          password,
          name,
        }
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  deleteWorker: async (ctx: any) => { // DOCUMENT_ID!!!
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      ctx.body = await strapi.documents('api::token.token').delete({
        documentId: id
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  updateWorker: async (ctx: any) => { // DOCUMENT_ID!!!
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      const data = ctx.request.body as IWorker
      const resultData = {} as IWorker
      if (data.name) resultData.name = data.name
      if (data.level) resultData.level = data.level
      if (data.password) resultData.password = data.password
      if (data.login) resultData.login = data.login
      ctx.body = await strapi.documents('api::token.token').update({
        documentId: id,
        data: resultData
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  createWork: async (ctx: any) => {
    try {
      const data = ctx.request.body as IWork

      const finishResponses: IPhoto[] = []
      const photosResponses: IPhoto[] = []

      const FormData = require('form-data');

      if (data.finish) {
        for (const base64String of data.finish) {
          const buffer = Buffer.from(base64String, 'base64');

          const form = new FormData();
          form.append('files', buffer, `${Math.random().toString()}.png`);

          try {
            const response = await axios.post('http://127.0.0.1:1337/api/upload', form, {
              headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.TOKEN}`,
              },
            });

            finishResponses.push(response.data[0] as IPhoto);
          } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
          }
        }
      }
      if (data.in_progress) {
        for (const base64String of data.in_progress) {
          const FormData = require('form-data');
          const buffer = Buffer.from(base64String, 'base64');

          const form = new FormData();
          form.append('files', buffer, `${Math.random().toString()}.png`);

          try {
            const response = await axios.post('http://127.0.0.1:1337/api/upload', form, {
              headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.TOKEN}`,
              },
            });

            photosResponses.push(response.data[0] as IPhoto);
          } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
          }
        }
      }
      const work = await strapi.documents('api::work.work').create({
        data: {
          name: data.name,
          description: data.description,
          photos: photosResponses.length > 0 ? photosResponses.map(it => it.id) : null
        }
      })
      ctx.body = await strapi.documents('api::worktime.worktime').create({
        data: {
          start: data.start,
          end: data.end,
          done: data.done ? data.done : false,
          finish: finishResponses.length > 0 ? finishResponses.map(it => it.id) : null,
          token: data.user,
          work: work.id
        }
      });
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  deleteWork: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      ctx.body = await strapi.documents('api::work.work').delete({
        documentId: id
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  deleteWorkTime: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      ctx.body = await strapi.documents('api::worktime.worktime').delete({
        documentId: id
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  updateWork: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      const work = ctx.request.body as IUWork
      const images = []
      const FormData = require('form-data');
      if (work.in_progress) {
        for (const base64String of work.in_progress) {
          const buffer = Buffer.from(base64String, 'base64');

          const form = new FormData();
          form.append('files', buffer, `${Math.random().toString()}.png`);

          try {
            const response = await axios.post('http://127.0.0.1:1337/api/upload', form, {
              headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.TOKEN}`,
              },
            });

            images.push(response.data[0] as IPhoto);
          } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
          }
        }
      }
      const prevWork = await strapi.documents('api::work.work').findFirst({
        populate: {
          photos: {
            fields: ['id'],
          },
        },
        filters: {
          $or: [
            {
              documentId: {
                $eq: id
              }
            },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      })
      ctx.body = await strapi.documents('api::work.work').update({
        documentId: prevWork.documentId,
        data: {
          name: work.name ? work.name : prevWork.name,
          description: work.description ? work.description : prevWork.description,
          photos: images.length > 0 ? images.map(it => it.id).concat(prevWork['photos'].map(item => item.id)) : prevWork['photos'].map(item => item.id),
        }
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  },
  updateWorkTime: async (ctx: any) => {
    try {
      ctx.response.set('Content-Type', 'application/json')
      const { id } = ctx.params
      const workTime = ctx.request.body as IUWorkTime
      const images = []
      const FormData = require('form-data');
      if (workTime.finish) {
        for (const base64String of workTime.finish) {
          const buffer = Buffer.from(base64String, 'base64');

          const form = new FormData();
          form.append('files', buffer, `${Math.random().toString()}.png`);

          try {
            const response = await axios.post('http://127.0.0.1:1337/api/upload', form, {
              headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.TOKEN}`,
              },
            });

            images.push(response.data[0] as IPhoto);
          } catch (error) {
            console.error('Error uploading file:', error.response ? error.response.data : error.message);
          }
        }
      }
      const prevWork = await strapi.documents('api::worktime.worktime').findFirst({
        populate: {
          finish: {
            fields: ['id'],
          },
        },
        filters: {
          $or: [
            {
              documentId: {
                $eq: id
              }
            },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      })
      ctx.body = await strapi.documents('api::worktime.worktime').update({
        documentId: prevWork.documentId,
        data: {
          start: workTime.start ? workTime.start : prevWork.start,
          end: workTime.end ? workTime.end : prevWork.end,
          done: workTime.done ? workTime.done : prevWork.done,
          finish: images.length > 0 ? images.map(it => it.id).concat(prevWork['finish'].map(item => item.id)) : prevWork['finish'].map(item => item.id),
        }
      })
    } catch (err) {
      ctx.status = 400
      ctx.body = err
    }
  }
}