import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateNoteRequest } from '../../requests/CreateNoteRequest'
import { createNote } from '../../businessLogic/notes'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newNote: CreateNoteRequest = JSON.parse(event.body)
    let userId = getUserId(event)
    const { noteId, name, dueDate, createdAt, done } = await createNote(userId, newNote)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: { noteId, name, dueDate, createdAt, done }
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)
