import { Document } from 'mongoose';

export interface Document extends Document {
  _id: string;

  /**
   * Returns true if this document was modified, else false.
   *
   * If `path` is given, checks if a path or any full path containing `path` as part of its path chain has been modified.
   *
   * ####Example
   *
   *     doc.set('documents.0.title', 'changed');
   *     doc.isModified()                      // true
   *     doc.isModified('documents')           // true
   *     doc.isModified('documents.0.title')   // true
   *     doc.isModified('documents otherProp') // true
   *     doc.isDirectModified('documents')     // false
   *
   * @param {string} [path] optional
   * @return {boolean}
   */
  isModified: (path: string) => boolean;
}
