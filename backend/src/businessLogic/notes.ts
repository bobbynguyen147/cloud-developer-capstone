import { NotesAccess } from '../dataLayer/notesAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate'
import { CreateNoteRequest } from '../requests/CreateNoteRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'

// TODO: Implement businessLogic

const logger = createLogger('Notes business logic')

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
  const bucketName = process.env.ATTACHMENT_S3_BUCKET
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION
  
  // TODO: Implement businessLogic
  const noteAccess = new NotesAccess();
  const attachmentUtils = new AttachmentUtils();
  export async function getAllNotes(userId: string): Promise<NoteItem[]> {
    return noteAccess.getAllNotes(userId);
  }
  
  export async function createNote(userId: string, createNoteRequest: CreateNoteRequest): Promise<NoteItem> {
  
    const itemId = uuid.v4()
  
    return await noteAccess.createNote({
      noteId: itemId,
      userId: userId,
      name: createNoteRequest.name,
      dueDate: createNoteRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
    })
  }
  
  export async function updateNote(noteId: string, userId: string, updateNoteRequest: UpdateNoteRequest): Promise<NoteUpdate> {
    return await noteAccess.updateNote(noteId, userId, {
      name: updateNoteRequest.name,
      dueDate: updateNoteRequest.dueDate,
      done: updateNoteRequest.done
    })
  }
  
  export async function deleteNote(noteId: string, userId: string) {
    await noteAccess.deleteNote(noteId, userId)
  }
  
  export async function createAttachmentPresignedUrl (noteId: string, userId: string) {
    logger.info('create attachment presigned url')
    const imageId = uuid.v4()
    const url = `https://${bucketName}.s3.amazonaws.com/${imageId}`
    await attachmentUtils.updateAttachmentUrl(noteId, userId, url)
    return getUploadUrl(imageId)
  }
  
  function getUploadUrl(imageId: string) {
    logger.info('get upload url')
    logger.info('urlExpiration:', urlExpiration)
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: Number(urlExpiration)
    })
  }
