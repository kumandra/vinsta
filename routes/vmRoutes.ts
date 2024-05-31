import express from 'express';
import {
  createVM,
  removeVM,
  listAllVM,
  stopVM,
  startVM,
  cloneVM,
  checkInfoVM,
} from './api/index';

const router = express.Router();




router.post('/create', createVM);
router.post('/remove', removeVM);
router.post('/start', startVM);
router.post('/stop', stopVM);
router.post('/clone', cloneVM);
router.post('/checkinfo', checkInfoVM);
router.get('/listall', listAllVM);


export default router;