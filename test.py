#!/usr/bin/python3
import os
import sys
import subprocess

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def run_test(testFile, expectedReturnCode):
    print(f"Running test: {testFile}")
    original_directory = os.getcwd()
    code_directory = os.path.join(os.getcwd(), "src")
    # Change directory
    os.chdir(code_directory)
    # Do operations
    p = subprocess.run(["node", "index.js", testFile])
    if (p.returncode == expectedReturnCode):
        print(bcolors.OKGREEN + "Test passed ✔" + bcolors.ENDC)
    else:
        print(bcolors.FAIL + "Test failed ❌" + bcolors.ENDC)
    # Change directory back
    os.chdir(original_directory)

def run_tests(testDirectory, testType, expectedReturnCode):
    print(bcolors.OKBLUE + bcolors.BOLD + f"Running tests for {testType}" + bcolors.ENDC)
    current_directory = os.path.abspath(os.path.dirname(__file__))
    test_directory = os.path.join(current_directory, f"input/{testDirectory}")
    test_files = os.listdir(test_directory)
    for file in test_files:
        file_path = os.path.join(test_directory, file)
        run_test(file_path, expectedReturnCode)

if __name__ == "__main__":
    test_suites = sys.argv[1:]
    if (len(test_suites) > 0):
        for suite_number in test_suites:
            valid_test_directory = f"stage_{suite_number}/valid"
            invalid_test_directory = f"stage_{suite_number}/invalid"
            # Run tests for valid programs
            run_tests(valid_test_directory, "Valid C programs", 0)
            # Run tests for invalid programs
            run_tests(invalid_test_directory, "Invalid C programs", 1)
    else:
        print("Please enter some numeric values of test suites to be run. Exiting")
        