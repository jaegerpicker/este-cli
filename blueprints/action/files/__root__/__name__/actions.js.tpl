import Promise from 'bluebird';
import setToString from '{{{rootPath}}}/../lib/settostring';
import {dispatch} from '../dispatcher';

// Put your actions here

// Override toString methods. Pretty useful for dispatched actions monitoring.
setToString('{{camelName}}', {});