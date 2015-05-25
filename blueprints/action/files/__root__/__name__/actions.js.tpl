import Promise from 'bluebird';
import setToString from '{{{rootPath}}}/../lib/settostring';
import {dispatch} from '../dispatcher';

// Override toString methods. Pretty useful for dispatched actions monitoring.
setToString('{{camelName}}', {});