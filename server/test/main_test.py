import json
import os
import tempfile
import unittest
import uuid

import main


class MyFirstTest(unittest.TestCase):
    def setUp(self):
        self.app = main.app.test_client()
        self.app.testing = True

        self.db_fd, self.db_path = tempfile.mkstemp()
        main.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///%s' % self.db_path
        main.app.config['TESTING'] = True
        main.app.config['PROPAGATE_EXCEPTIONS'] = True
        main.db.create_all()
        # self.app.get('/init')  # init the db

    def tearDown(self):
        os.close(self.db_fd)
        os.remove(self.db_path)

    def test_index(self):
        r = self.app.get('/')
        assert r.status_code == 200
        assert 'Omnidyalog' in r.data.decode('utf-8')

    def get_json(self, path):
        res = self.app.get(path)
        self.assertEqual(res.status_code, 200)
        return json.loads(res.data.decode('utf-8'))

    def post_json(self, path, **kwargs):
        data = json.dumps(dict(**kwargs), sort_keys=True, indent=2)
        res = self.app.post(path, data=data, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        return json.loads(res.data.decode('utf-8'))

    def test_page_comment_crud(self):
        # get a random page url
        page_url = 'http://' + str(uuid.uuid4()) + '/'
        # get the oid from that page
        page_oid = self.get_json('/pages?url=%s' % page_url)['oid']
        self.assertIsNotNone(page_oid)
        page_oid_2 = self.get_json('/pages?url=%s' % page_url)['oid']
        self.assertEqual(page_oid, page_oid_2)
        # get the comments from that page => empty
        ep_com = '/pages/%s/comments' % page_oid
        page_comments = self.get_json(ep_com)['comments']
        self.assertEqual(len(page_comments), 0)
        # add a comment
        comment_content = str(uuid.uuid4())
        self.post_json(ep_com, text=comment_content)
        # get the comments from that page => 1 more
        page_comments = self.get_json(ep_com)['comments']
        self.assertEqual(len(page_comments), 1)
        self.assertEqual(page_comments[0]['text'], comment_content)

        # second comment, should come after
        comment_content2 = str(uuid.uuid4())
        self.post_json(ep_com, text=comment_content2)
        # get the comments from that page => 1 more
        page_comments = self.get_json(ep_com)['comments']
        self.assertEqual(len(page_comments), 2)
        self.assertEqual(page_comments[0]['text'], comment_content)
        self.assertEqual(page_comments[1]['text'], comment_content2)

    def test_static_page(self):
        req = self.app.get('/static/toto.txt')
        self.assertEqual(req.data, b'Hello world !')
        req.close()


class WithoutDBTest(unittest.TestCase):
    def setUp(self):
        self.app = main.app.test_client()
        self.app.testing = True

        self.db_fd, self.db_path = tempfile.mkstemp()
        del main.app.config['SQLALCHEMY_DATABASE_URI']
        main.app.config['TESTING'] = True
        main.app.config['PROPAGATE_EXCEPTIONS'] = True
        # self.app.get('/init')  # init the db

    def test_without_db(self):
        assert self.app.get('/ping').status_code == 200
        assert 'pong' == self.app.get('/ping').data.decode('utf-8')

class LiveCheckTest(unittest.TestCase):
    def setUp(self):
        self.app = main.app.test_client()
        self.app.testing = True

        self.db_fd, self.db_path = tempfile.mkstemp()
        del main.app.config['SQLALCHEMY_DATABASE_URI']
        main.app.config['TESTING'] = True
        main.app.config['PROPAGATE_EXCEPTIONS'] = True
        # self.app.get('/init')  # init the db

    def get_json(self, path):
        res = self.app.get(path)
        self.assertEqual(res.status_code, 200)
        return json.loads(res.data.decode('utf-8'))

    def test_check_mongo(self):
        assert 'all_db' in self.get_json('/check/mongo')




if __name__ == '__main__':
    unittest.main()
