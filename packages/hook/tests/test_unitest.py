
import unittest

from ak import a


class TestSimple(unittest.TestCase):

    def test_add_one(self):
        self.assertEqual(a.add(), 6)


if __name__ == '__main__':
    unittest.main()