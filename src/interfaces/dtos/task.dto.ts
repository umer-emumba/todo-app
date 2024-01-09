export class CreateTaskDto {
  declare title: string;
  declare description: string;
  declare due_at: Date;
  declare task_attachments?: Attachment[];
}

export enum AttachmentType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  PDF = "PDF",
  DOC = "DOC",
}

class Attachment {
  declare attachment_url: string;
  declare attachment_type: AttachmentType;
}
