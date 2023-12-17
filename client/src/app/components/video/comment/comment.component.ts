import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'video-comment',
  template: `
    <div class="comment-container">
      <span><b>{{username}}</b></span>
      <span class="d-block">{{comment}}</span>
    </div>
  `,
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() public comment: string = 'test comment';
  @Input() public username: string = 'test username';

  constructor() { }

  ngOnInit() { }
}