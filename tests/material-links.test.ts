import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertHtmlImagesToMarkdown, githubMaterialBaseUrl, resolveMaterialAssetUrl, resolveMaterialLinkUrl } from '../lib/material-links.ts';
import { markdownUrlTransform } from '../lib/markdown-url-transform.ts';

test('GitHub media paths resolve from a branch containing a slash', () => {
  const source = 'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/lesson/notes.ipynb';
  const base = githubMaterialBaseUrl(source);
  assert.equal(base, 'https://raw.githubusercontent.com/gwinell/proglang-courses/codetogether/python-course/python/lesson/');
  assert.equal(resolveMaterialAssetUrl('../assets/flow chart.png', base), 'https://raw.githubusercontent.com/gwinell/proglang-courses/codetogether/python-course/python/assets/flow%20chart.png');
});

test('Markdown images keep private API paths and reject unsafe schemes', () => {
  assert.equal(resolveMaterialAssetUrl('/api/assignment-images/image-id'), '/api/assignment-images/image-id');
  assert.equal(resolveMaterialAssetUrl('javascript:alert(1)'), undefined);
  assert.equal(resolveMaterialAssetUrl('http://example.com/image.png'), undefined);
  assert.equal(resolveMaterialAssetUrl('https://example.com/image.png'), 'https://example.com/image.png');
  const base = 'https://raw.githubusercontent.com/gwinell/proglang-courses/codetogether/python-course/python/03_collections/01_lists/';
  assert.equal(resolveMaterialLinkUrl('../04_iterators/lesson.ipynb', base), 'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/04_iterators/lesson.ipynb');
  assert.equal(resolveMaterialLinkUrl('steps/', 'https://raw.githubusercontent.com/gwinell/proglang-courses/codetogether/python-course/python/04_pygame/03_doodle_jump/'), 'https://github.com/gwinell/proglang-courses/tree/codetogether/python-course/python/04_pygame/03_doodle_jump/steps/');
});

test('legacy HTML image tags become safe Markdown image nodes', () => {
  assert.equal(
    convertHtmlImagesToMarkdown('<img src="assets/gameplay.png" width="300" alt="Кадр игры">'),
    '![Кадр игры](<assets/gameplay.png>)',
  );
  assert.equal(convertHtmlImagesToMarkdown('<img alt="no source">'), '');
});

test('only local image previews allow blob URLs through Markdown URL sanitization', () => {
  const blobUrl = 'blob:https://codetogether.example/12345678-1234-1234-1234-123456789012';
  assert.equal(markdownUrlTransform(blobUrl, 'src', true), blobUrl);
  assert.equal(markdownUrlTransform(blobUrl, 'src'), '');
  assert.equal(markdownUrlTransform(blobUrl, 'href', true), '');
  assert.equal(markdownUrlTransform('javascript:alert(1)', 'src', true), '');
  assert.equal(markdownUrlTransform('/api/assignment-images/123', 'src', true), '/api/assignment-images/123');
});
