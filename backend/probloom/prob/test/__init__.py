import unittest


def suite():
    return unittest.TestLoader().discover("prob.tests", pattern="*.py")
