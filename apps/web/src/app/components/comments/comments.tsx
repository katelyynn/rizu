'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth_context';
import styles from "./comments.module.css";
import { Author, Comment } from '@rizu/shared';
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

  const submitComment = async (content: string, parent?: string) => {
    if (!content.trim() || !user) return;

    setLoading(true);
    setError('');

    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      created: new Date().toISOString(),
      parent: parent || null,
      author: user
    };

    setComments(prev => [tempComment].concat(prev));
    setText('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          content: content.trim(),
          parent: parent || null,
          type,
          id
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'failed to post');

      const realComment = JSON.parse(JSON.stringify(data.comment));
      const tempId = JSON.stringify(tempComment.id);

      setComments(prev => {
        return prev.filter(c => c && JSON.stringify(c.id) != tempId)
        .concat([realComment]);
      });
    } catch (error) {
      setComments(prev => prev.filter(c => c && JSON.stringify(c.id) != JSON.stringify(tempComment.id)));
      setText(content);
      setError(error.message || 'failed to post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const buildTree = (flat: Comment[]): Comment[] => {
    const map = new Map<string, Comment>();
    const tree: Comment[] = [];

    flat.forEach(c => {
      if (c && c.id) {
        map.set(c.id, Object.assign({}, c, { children: [] }));
      }
    });

    flat.forEach(c => {
      if (!c || !c.id) return;

      const node = map.get(c.id);
      if (!node) return;

      if (c.parent && map.has(c.parent)) {
        const parent = map.get(c.parent);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      } else if (!c.parent) {
        tree.push(node);
      }
    });

    return tree;
  }

  const nested = buildTree(comments);

  return (
    <section className={styles.comments}>
      <h3>Comments</h3>
      {error && <p>Error: {error}</p>}
      {user && (
        <RizuCommentForm author={user} text={text} setText={setText} loading={loading} onSubmit={submitComment} />
      )}
      {nested.map(comment => (
        <RizuComment key={comment.id} comment={comment} user={user} type={type} id={id} onReply={submitComment} />
      ))}
    </section>
  )
}

interface RizuCommentFormProps {
  author: Author,
  parent?: string,
  text: string,
  setText: (text: string) => void,
  loading: boolean,
  onSubmit: (content: string, parent?: string) => void
}

function RizuCommentForm({
  author,
  parent,
  text,
  setText,
  loading,
  onSubmit
}: RizuCommentFormProps) {
  // hybrid for replies and main form

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(text, parent); }} className={styles.commentForm}>
      <RizuAvatar src={author.avatar} alt={author.username} />
      <Link className={styles.username} href={`/user/${author.slug}`}>{author.username}</Link>
      <textarea className={styles.textarea} value={text} onChange={e => setText(e.target.value)} disabled={loading} />
      <button disabled={loading || !text.trim()}>post</button>
    </form>
  )
}

interface RizuCommentProps {
  user?: Author,
  comment: Comment,
  type: string,
  id: string,
  onReply: (content: string, parent: string) => void
}

function RizuComment({
  user,
  comment,
  type,
  id,
  onReply
}: RizuCommentProps) {
  const [ showForm, setShowForm ] = useState(false);
  const [ text, setText ] = useState('');

  const handleReply = (e: SubmitEvent) => {
    onReply(text, comment.id);
    setText('');
    setShowForm(false);
  }

  return (
    <div className={`${styles.comment} ${comment.parent ? styles.hasParent : ''}`}>
      <RizuAvatar src={comment.author.avatar} alt={comment.author.username} />
      <Link className={styles.username} href={`/user/${comment.author.slug}`}>{comment.author.username}</Link>
      <RizuMarkdown text={comment.content} />
      <p className={styles.time}>{DateTime.fromISO(comment.created).toRelative()}</p>
      {user && (<button onClick={() => setShowForm(!showForm)}>reply</button>)}
      <p>---</p>
      {(showForm && user) && (
        <RizuCommentForm onSubmit={handleReply} parent={comment.id} text={text} setText={setText} author={user} />
      )}
      {comment.children && comment.children.length > 0 && (
        <div className={styles.children}>
          {comment.children.map(child => (
            <RizuComment key={child.id} comment={child} user={user} type={type} id={id} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}