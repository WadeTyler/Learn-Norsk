import {Question} from "@/types/Types";

class Node {
  val: Question;
  next?: Node;

  constructor(question: Question) {
    this.val = question;
  }
}

export class QuestionQueue {
  head?: Node;
  tail?: Node;
  length = 0;

  constructor() {}

  enqueue(question: Question) {
    const node = new Node(question);
    this.length++;
    // Empty Queue, set head and tail to node
    if (!this.tail) {
      this.head = this.tail = node;
      return;
    }

    // Set tail to node, then update tail to that node
    this.tail.next = node;
    this.tail = node;
  }

  dequeue() {
    if (!this.head) return null;
    this.length--;

    // if only 1 item in queue, set head/tail to undefined then return the temp
    if (this.length === 0) {
      const temp = this.head;
      this.head = this.tail = undefined;
      return temp.val;
    }

    // More than 1 item, set head to head.next then return temp
    const temp = this.head;
    this.head = this.head.next;
    return temp.val;
  }

  log() {
    let temp = this.head;
    while (temp) {
      console.log(temp.val);
      temp = temp.next;
    }
  }

}