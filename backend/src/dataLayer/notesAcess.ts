import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Notes data access')

// TODO: Implement the dataLayer logic
export class NotesAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly notesTable = process.env.NOTES_TABLE,
    private readonly noteCreatedIndex = process.env.NOTES_CREATED_AT_INDEX
  ) {
  }

  async getAllNotes(userId: string): Promise<NoteItem[]> {
    logger.info('Getting all notes')

    const result = await this.docClient.query({
      TableName: this.notesTable,
      IndexName: this.noteCreatedIndex,
      KeyConditionExpression: 'userId = :pk',
      ExpressionAttributeValues: {
        ':pk': userId
      }
    }).promise()

    const items = result.Items
    return items as NoteItem[]
  }

  async createNote(noteItem: NoteItem): Promise<NoteItem> {
    logger.info('Create new note')

    await this.docClient.put({
      TableName: this.notesTable,
      Item: noteItem
    }).promise()

    return noteItem
  }

  async updateNote(noteId: String, userId: String, updateNoteItem: NoteUpdate): Promise<NoteUpdate> {
    logger.info('Update note')

    await this.docClient.update({
      TableName: this.notesTable,
      Key: {
        noteId: noteId,
        userId: userId
      },
      UpdateExpression: "set #note_name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: {
        '#note_name': 'name',
      },
      ExpressionAttributeValues: {
        ":name": updateNoteItem.name,
        ":dueDate": updateNoteItem.dueDate,
        ":done": updateNoteItem.done
      }
    }).promise()

    return updateNoteItem
  }

  async deleteNote(noteId: String, userId: String) {
    logger.info('Delete note')

    await this.docClient.delete({
      TableName: this.notesTable,
      Key: {
        noteId: noteId,
        userId: userId
      }
    }, (err) => {
      if (err) {
        throw new Error("")
      }
    }).promise()
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}