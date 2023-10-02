import express from 'express';
import cors from 'cors';

export const initCORS = (app: express.Application): void => {
  app.use(
    cors({
      origin: '*'
    })
  );
};
