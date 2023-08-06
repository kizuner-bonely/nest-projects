import * as Imap from 'imap';
import { MailParser } from 'mailparser';

export default class IMapManager {
  private imap: Imap;
  private results: number[] = [];
  private mails: Record<string, any>[] = [];

  createImap(user: string, password: string) {
    this.imap = new Imap({
      user,
      password,
      host: 'imap.qq.com',
      port: 993,
      tls: true,
    });

    return this;
  }

  ready() {
    this.imap.once('ready', () => {
      this.imap.openBox('INBOX', true, (err) => {
        this.imap.search(
          [
            ['SEEN'],
            ['SINCE', new Date('2023-08-05 00:00:00').toLocaleString()],
          ],
          (err, results) => {
            if (!err) {
              console.log('results', results);
              this.results = results;
            } else {
              throw err;
            }
          },
        );
      });
    });

    return this;
  }

  connect() {
    this.imap.connect();
    return this;
  }

  handleResults() {
    this.imap.fetch(this.results, { bodies: '' }).on('message', (msg) => {
      const mailParser = new MailParser();

      msg.on('body', (stream) => {
        const info: Record<string, any> = {};
        stream.pipe(mailParser);

        mailParser.on('headers', (headers) => {
          info.theme = headers.get('subject');
          info.from = (headers.get('from') as any).value[0].address;
          info.mailName = (headers.get('from') as any).value[0].name;
          info.to = (headers.get('from') as any).value[0].address;
          info.date = headers.get('date').toLocaleString();
        });

        mailParser.on('data', (data) => {
          switch (data.type) {
            case 'text': {
              info.html = data.html;
              info.text = data.text;
              console.log(info);
              this.mails.push(info);
              break;
            }
            case 'attachment': {
              break;
            }
            default:
              break;
          }
        });
      });
    });
  }

  run(user: string, password: string) {
    this.createImap(user, password).ready().connect();
    setTimeout(() => {
      this.handleResults();
    }, 1000);
  }

  getMail() {
    return this.mails;
  }
}
