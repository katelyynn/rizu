'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth_context';
import styles from "./comments.module.css";
import { Comment } from '@rizu/shared';
import { RizuAvatar } from '../avatar/avatar';
import Link from 'next/link';
import { RizuMarkdown } from '../markdown/markdown';
import { DateTime } from 'luxon';

interface RizuCommentsProps {
  type: string,
  id: string
}

export function RizuComments({
  type,
  id
}: RizuCommentsProps) {
  const { user } = useAuth();
  const [ comments, setComments ] = useState<Comment[]>([]);
  const [ text, setText ] = useState('');
  const [ error, setError ] = useState('');
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${type}/${id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(error => console.error(error));
  }, [ type, id ]);

  const submitComment = async (content: string, parent: string | null = null) => {
    if (!content.trim() || !user) return;

    setLoading(true);
    setError('');

    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      created: new Date().toISOString(),
      parent: parent,
      author: user
    };

    setComments(prev => [ tempComment, ...prev ]);
    setText('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
          parent,
          type,
          id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'failed to post');

      setComments(prev => prev.map(c => c.id == tempComment.id ? data.comment : c));
    } catch (error) {
      setComments(prev => prev.filter(c => c.id != tempComment.id));
      setText(content);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const buildTree = (flat: Comment[]): Comment[] => {
    const map = new Map<string, Comment>();
    const tree: Comment[] = [];

    flat.forEach(c => map.set(c.id, { ...c, children: [] }));
    flat.forEach(c => {
      if (c.parent && map.has(c.parent)) {
        map.get(c.parent)!.children!.push(map.get(c.id)!);
      } else {
        tree.push(map.get(c.id)!);
      }
    });

    return tree;
  }

  const nested = buildTree(comments);
}

interface RizuCommentFormProps {

}

function RizuCommentForm({

}: RizuCommentFormProps) {
  // hybrid for replies and main form
}

interface RizuCommentProps {
  comment: Comment,
  type: string,
  id: string,
  onReply: (content: string, parent: string) => void
}

function RizuComment({
  comment,
  type,
  id,
  onReply
}: RizuCommentProps) {
  const [ showForm, setShowForm ] = useState(false);
  const [ text, setText ] = useState('');

  const handleReply = (e: SubmitEvent) => {
    e.preventDefault();
    onReply(text, comment.id);
    setText('');
    setShowForm(false);
  }

  return (
    <li className={`${styles.comment} ${comment.parent ? styles.hasParent : ''}`}>
      <RizuAvatar src={comment.author.avatar} alt={comment.author.username} />
      <Link className={styles.username} href={`/user/${comment.author.slug}`}>{comment.author.username}</Link>
      <RizuMarkdown text={comment.content} />
      <p className={styles.time}>{DateTime.fromISO(comment.created).toRelative()}</p>
      <button onClick={() => setShowForm(!showForm)}>reply</button>
      <p>---</p>
      {showForm && (
        <form onSubmit={handleReply}>
          // use rizucomment form
        </form>
      )}
      // show children
    </li>
  )
}