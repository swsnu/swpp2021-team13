Views
=====

User and Authentication
-----------------------

.. autoclass:: prob.views.SignUpView
   :members:

.. autoclass:: prob.views.SignInView
   :members:

.. autoclass:: prob.views.SignOutView
   :members:

.. autofunction:: prob.views.get_user

.. autofunction:: prob.views.get_current_user

.. autoclass:: prob.views.UserProfileView
   :members:

.. autofunction:: prob.views.get_user_statistics

Problem Set
-----------

.. autoclass:: prob.views.ProblemSetListView
   :members:

.. autoclass:: prob.views.ProblemSetInfoView
   :members:

.. autoclass:: prob.views.ProblemSetCommentListView
   :members:

.. autoclass:: prob.views.ProblemSetCommentInfoView
   :members:

.. autofunction:: prob.views.update_problem_set_recommendation

Problem
-------

.. autoclass:: prob.views.ProblemInfoView
   :members:

.. autofunction:: prob.views.solve_problem

.. autofunction:: prob.views.find_solvers

.. autofunction:: prob.views.get_solver

Miscellaneous
-------------

.. autofunction:: prob.views.token
